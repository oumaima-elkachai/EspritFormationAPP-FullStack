pipeline {
    agent any

    environment {
        GITHUB_CREDENTIALS = 'github-token'
        SONAR_CREDENTIALS  = 'sonar-token'
        DOCKER_CREDENTIALS = 'dockerhub-credentials'
        SONAR_HOST         = 'http://SONAR_SERVER:9000'     // remplace par ton serveur Sonar
        IMAGE_NAMESPACE    = 'oumaimaelkachai'               // ton DockerHub username
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    credentialsId: "${GITHUB_CREDENTIALS}",
                    url: 'https://github.com/oumaima-elkachai/EspritFormationAPP-FullStack.git'
            }
        }

        stage('Unit Tests') {
            steps {
                script {
                    def services = ["eureka-service", "user-service", "formation-service"]
                    for (s in services) {
                        dir("backend/${s}") {
                            echo "🔍 Running unit tests for ${s}"
                            sh 'mvn -B clean test'
                        }
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withCredentials([string(credentialsId: "${SONAR_CREDENTIALS}", variable: 'SONAR_TOKEN')]) {
                    script {
                        def services = ["eureka-service", "user-service", "formation-service"]
                        for (s in services) {
                            dir("backend/${s}") {
                                sh """
                                mvn -B sonar:sonar \
                                  -Dsonar.projectKey=${s} \
                                  -Dsonar.host.url=${SONAR_HOST} \
                                  -Dsonar.login=${SONAR_TOKEN}
                                """
                            }
                        }
                    }
                }
            }
        }

        stage('Build Artifacts (.jar)') {
            steps {
                script {
                    def services = ["eureka-service", "user-service", "formation-service"]
                    for (s in services) {
                        dir("backend/${s}") {
                            echo "⚙️ Building ${s}"
                            sh 'mvn -B clean package -DskipTests'
                        }
                    }
                }
            }
        }

        stage('Build & Push Docker Images') {
            steps {
                script {
                    def commit = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                    env.IMAGE_TAG = "${commit}-${env.BUILD_NUMBER}"

                    withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDENTIALS}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'

                        def services = ["eureka-service", "user-service", "formation-service"]
                        for (s in services) {
                            sh """
                            docker build -t $DOCKER_USER/${s}:${IMAGE_TAG} -t $DOCKER_USER/${s}:latest -f backend/${s}/Dockerfile backend/${s}
                            docker push $DOCKER_USER/${s}:${IMAGE_TAG}
                            docker push $DOCKER_USER/${s}:latest
                            """
                        }
                    }
                }
            }
        }

        stage('Deploy via Docker Compose') {
            steps {
                script {
                    sh """
                    # Génère le fichier .env pour Docker Compose
                    echo "IMAGE_TAG=${IMAGE_TAG}" > backend/deploy/.env
                    echo "DOCKER_USER=${DOCKER_USER}" >> backend/deploy/.env

                    # Déploiement
                    cd backend/deploy
                    docker-compose pull || true
                    docker-compose up -d --remove-orphans
                    """
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'backend/**/target/*.jar', fingerprint: true
        }
    }
}
