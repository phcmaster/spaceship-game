# Multiplayer Game with Real-Time Leaderboard


### Overview

This project implements a real-time multiplayer game where players can join sessions, compete, and see their scores on a dynamic leaderboard. The backend is designed to handle multiple sessions and players simultaneously using modern cloud-native technologies like Amazon EKS, Karpenter, KEDA, DynamoDB, Redis, and Amazon S3.


Here’s a comprehensive README file for the multiplayer game project. It provides details about the setup, architecture, and usage of the project.
Multiplayer Game with Real-Time Leaderboard
Overview

This project implements a real-time multiplayer game where players can join sessions, compete, and see their scores on a dynamic leaderboard. The backend is designed to handle multiple sessions and players simultaneously using modern cloud-native technologies like Amazon EKS, Karpenter, KEDA, DynamoDB, Redis, and Amazon S3.


## Features

- Real-time gameplay: Players compete in sessions managed by WebSocket communication.
- Leaderboard: Dynamic leaderboard updates with the players' scores in each session.
- Scalable backend: The application uses Karpenter and KEDA to automatically scale with demand.
- Persistence: Scores are saved in DynamoDB for long-term storage.
- Static assets: Frontend assets are hosted on Amazon S3 for efficient delivery.



Setup
1. Backend

    Clone the repository:
```
git clone https://github.com/phcmaster/spaceship-game.git
```
```
cd multiplayer-game
```
Install dependencies:
```
npm install
```
Set environment variables: Create a .env file:

REDIS_URL=redis://<your-redis-url>
AWS_REGION=<your-aws-region>
DYNAMODB_TABLE=GameLeaderboard

Replace placeholders with your actual Redis URL and DynamoDB details.

Start the backend locally (for testing):

    npm start

2. Redis Deployment

Deploy Redis on your EKS cluster using Helm:

helm repo add bitnami https://charts.bitnami.com/bitnami
helm install redis bitnami/redis

Retrieve the Redis connection string:

kubectl get secret --namespace default redis -o jsonpath="{.data.redis-password}" | base64 -d

Update the REDIS_URL in your .env file with the connection string.
3. DynamoDB Table

Create a DynamoDB table:

    Table Name: GameLeaderboard
    Partition Key: sessionId (String)
    Sort Key: playerId (String)

No additional configurations are required.
4. Frontend Deployment

    Navigate to the frontend/ directory:

cd frontend

Upload assets to an S3 bucket:

aws s3 sync . s3://<your-s3-bucket-name> --acl public-read

Enable Static Website Hosting for the bucket:

aws s3 website s3://<your-s3-bucket-name>/ --index-document index.html

Access the game via the S3 bucket URL:

    http://<your-s3-bucket-name>.s3-website-<region>.amazonaws.com

5. Kubernetes Deployment

    Build and push the backend image:

docker build -t <your-ecr-repo>/multiplayer-backend .
docker push <your-ecr-repo>/multiplayer-backend

Apply Kubernetes manifests:

```
    kubectl apply -f k8s/deployment.yaml
    kubectl apply -f k8s/service.yaml
```
- Configure Karpenter: Deploy the karpenter.yaml configuration to scale your nodes dynamically.

- Configure KEDA: Deploy the keda.yaml configuration to scale based on WebSocket connections.

## Leaderboard

The leaderboard dynamically updates during the game. Player scores are stored in Redis for real-time updates and DynamoDB for persistence.
Scaling and Monitoring

- Karpenter: Automatically provisions nodes based on the workload.

- KEDA: Scales the backend pods based on Redis queue length (e.g., WebSocket connections).

- CloudWatch: Monitor logs and application metrics.

## Testing

- Open multiple browser tabs to simulate multiple players.
- Join a session and play the game.
- Check the leaderboard updates in real-time.

## Troubleshooting

    WebSocket Issues: Check the backend logs for WebSocket errors:

kubectl logs <backend-pod-name>

Scaling Issues: Verify Karpenter and KEDA configurations:

    kubectl get pods -A

    DynamoDB Errors: Ensure the table and AWS permissions are correctly configured.

## Future Enhancements

    Add authentication to manage unique player identities.
    Store historical scores for advanced analytics.
    Introduce game modes and multiple maps.

## License

This project is open-sourced under the MIT License.
