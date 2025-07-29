pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('ghcr-token')
    }

    stages {
        stage('Checkout') {
            steps {
                echo "🔁 [Checkout] Cloning repository..."
                checkout scm
                echo "✅ [Checkout] Code checked out"
            }
        }

        stage('Install dependencies - Frontend') {
            steps {
                echo "🔧 [Install] Creating container and copying frontend files..."
                sh '''
                    docker create --name tmp-frontend node:20 sh -c '
                        cd /app &&
                        echo "[🛠️ DEBUG] Current directory: $(pwd)" &&
                        echo "[📦 DEBUG] Listing contents..." &&
                        ls -la &&
                        echo "[📍 DEBUG] Node version: $(node -v)" &&
                        echo "[📍 DEBUG] NPM version: $(npm -v)" &&
                        echo "[📦 DEBUG] Installing frontend dependencies..." &&
                        npm install
                    '
                    echo "[📦 DEBUG] Copying frontend source to container..."
                    docker cp ./frontend/. tmp-frontend:/app
                    echo "[▶️ DEBUG] Starting container to install dependencies..."
                    docker start -a tmp-frontend
                    docker rm tmp-frontend
                    echo "✅ [Install] Dependencies installed successfully"
                '''
            }
        }

        stage('Run tests - Frontend') {
            steps {
                echo "🧪 [Test] Launching frontend tests in a clean container..."
                sh '''
                    docker create --name test-frontend node:20 sh -c '
                        cd /app &&
                        echo "[🔄 DEBUG] Installing test dependencies..." &&
                        npm install &&
                        echo "[🧪 DEBUG] Running test suite..." &&
                        npm test
                    '
                    echo "[📦 DEBUG] Copying frontend files into test container..."
                    docker cp ./frontend/. test-frontend:/app
                    echo "[▶️ DEBUG] Starting test container..."
                    docker start -a test-frontend
                    docker rm test-frontend
                    echo "✅ [Test] Tests completed successfully"
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "🐳 [Build] Building frontend Docker image..."
                sh '''
                    docker build -t lhenryaxel/todolist-frontend:latest ./frontend
                    echo "✅ [Build] Docker image built: lhenryaxel/todolist-frontend:latest"
                '''
            }
        }

        stage('Push to GitHub Packages') {
            steps {
                echo "📦 [Push] Pushing Docker image to GitHub Packages (ghcr.io)..."
                sh '''
                    echo "${DOCKERHUB_CREDENTIALS_PSW}" | docker login ghcr.io -u "${DOCKERHUB_CREDENTIALS_USR}" --password-stdin
                    docker tag lhenryaxel/todolist-frontend:latest ghcr.io/lhenryaxel/todolist-frontend:latest
                    docker push ghcr.io/lhenryaxel/todolist-frontend:latest
                    echo "✅ [Push] Image pushed: ghcr.io/lhenryaxel/todolist-frontend:latest"
                '''
            }
        }

        stage('Tag Git repo') {
            steps {
                echo "📌 [Git] Tagging repository with version..."
                withCredentials([usernamePassword(credentialsId: 'ghcr-token', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                    sh '''
                        git config user.email "ci@todo.com"
                        git config user.name "CI Bot"
                        VERSION_TAG="v1.0.${BUILD_NUMBER}"
                        git tag -a $VERSION_TAG -m "Build $BUILD_NUMBER"
                        git push https://${GIT_USER}:${GIT_PASS}@github.com/LhenryAxel/todolist.git --tags
                        echo "✅ [Git] Repository tagged with $VERSION_TAG"
                    '''
                }
            }
        }
    }

    post {
        always {
            echo "🧹 [Cleanup] Cleaning up workspace..."
            cleanWs()
        }
        failure {
            echo "❌ [Failure] Build failed. Check logs above for more info."
        }
    }
}
