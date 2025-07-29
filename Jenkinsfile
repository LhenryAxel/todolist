pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('ghcr-token')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "✅ Code checked out"
            }
        }

        stage('Install dependencies - Frontend') {
            steps {
                echo "🔧 Installing Frontend dependencies using docker cp"
                sh '''
                    docker create --name tmp-frontend node:20 sh -c '
                        cd /app &&
                        echo "[DEBUG] In container:" && pwd &&
                        ls -la &&
                        echo "[DEBUG] Node:" && node -v &&
                        echo "[DEBUG] NPM:" && npm -v &&
                        echo "[DEBUG] Running npm install..." &&
                        npm install
                    '
                    docker cp ./frontend/. tmp-frontend:/app
                    docker start -a tmp-frontend
                    docker rm tmp-frontend
                '''
            }
        }

        stage('Run tests - Frontend') {
            steps {
                echo "🧪 Running frontend tests..."
                sh '''
                    docker run --rm -v "$PWD/frontend:/app" -w /app node:20 npm test
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "🐳 Building frontend Docker image..."
                sh '''
                    docker build -t lhenryaxel/todolist-frontend:latest ./frontend
                '''
            }
        }

        stage('Push to GitHub Packages') {
            steps {
                echo "📦 Pushing frontend Docker image..."
                sh '''
                    echo "${DOCKERHUB_CREDENTIALS_PSW}" | docker login ghcr.io -u "${DOCKERHUB_CREDENTIALS_USR}" --password-stdin
                    docker tag lhenryaxel/todolist-frontend:latest ghcr.io/lhenryaxel/todolist-frontend:latest
                    docker push ghcr.io/lhenryaxel/todolist-frontend:latest
                '''
            }
        }
    }

    post {
        always {
            echo "🧹 Cleaning up workspace..."
            cleanWs()
        }
        failure {
            echo "❌ Build failed. Check above logs for more details."
        }
    }
}
