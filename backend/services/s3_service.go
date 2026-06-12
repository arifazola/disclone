package services

import (
	"context"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type S3Service struct {
	client *s3.Client
}

func NewS3Service(ctx context.Context) (*S3Service, error) {
	cfg, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		return nil, err
	}

	return &S3Service{
		client: s3.NewFromConfig(cfg),
	}, nil
}

func (s *S3Service) GenerateUploadURL(
	ctx context.Context,
	bucket string,
	key string,
) (string, error) {

	presigner := s3.NewPresignClient(s.client)

	req, err := presigner.PresignPutObject(
		ctx,
		&s3.PutObjectInput{
			Bucket:      &bucket,
			Key:         &key,
			ContentType: aws.String("image/jpeg"),
		},
		s3.WithPresignExpires(15*time.Minute),
	)

	if err != nil {
		return "", err
	}

	return req.URL, nil
}
