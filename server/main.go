package main

import (
    "context"
    "log"
    "net/http"

    "github.com/golang/protobuf/ptypes/empty"
    pb "messenger-sample/messenger"

		"github.com/improbable-eng/grpc-web/go/grpcweb"
    "google.golang.org/grpc"
)

const (
    port = ":9090"
)

type server struct {
    pb.UnimplementedMessengerServer
    requests []*pb.MessageRequest
}

func (s *server) GetMessages(_ *empty.Empty, stream pb.Messenger_GetMessagesServer) error {
	previousCount := len(s.requests)

	for {
			currentCount := len(s.requests)
			if previousCount < currentCount {
					r := s.requests[currentCount-1]
					log.Printf("Sent: %v", r.GetMessage())
					if err := stream.Send(&pb.MessageResponse{Message: r.GetMessage()}); err != nil {
							return err
					}
			}
			previousCount = currentCount
	}
}

func (s *server) CreateMessage(ctx context.Context, r *pb.MessageRequest) (*pb.MessageResponse, error) {
	log.Printf("Received: %v", r.GetMessage())
	newR := &pb.MessageRequest{Message: r.GetMessage()}
	s.requests = append(s.requests, newR)
	return &pb.MessageResponse{Message: r.GetMessage()}, nil
}

func main() {
    // lis, err := net.Listen("tcp", port)
    // if err != nil {
    //     log.Fatalf("failed to listen: %v", err)
    // }
    s := grpc.NewServer()
    pb.RegisterMessengerServer(s, &server{})
    // reflection.Register(s)
    // if err := s.Serve(lis); err != nil {
    //     log.Fatalf("failed to serve: %v", err)
    // }

		mux := http.NewServeMux()
		ws := grpcweb.WrapServer(s,
		      	grpcweb.WithOriginFunc(func(origin string) bool { return true }))
		mux.Handle("/", http.HandlerFunc(ws.ServeHTTP))

		hs := &http.Server{
		 	Addr: port,
			Handler: mux,
		}
		hs.ListenAndServe()
}