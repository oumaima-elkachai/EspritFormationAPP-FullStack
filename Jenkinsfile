pipeline {
    agent any

    environment {
        GITHUB_CREDENTIALS = 'github-token'
        SONAR_CREDENTIALS  = 'sonar-token'
        DOCKER_CREDENTIALS = 'dockerhub-credentials'
        SONAR_HOST = 'http://192.168.6.161:9000'
        IMAGE_NAMESPACE = 'oumaimakachai'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    credentialsId: "${GITHUB_CREDENTIALS}",
                    url: 'https://github.com/oumaima-elkachai/EspritFormationAPP-FullStack.git'
            }
        }

        stage('Unit Tests Backend') {
            steps {
                script {
                    def services = ["Eureka-Server","User-Service","Formation-Service"]
                    for (s in services) {
                        dir("backend/stage-ete-main/${s}") {
                            echo "🔍 Running unit tests for ${s}"
                            sh 'mvn -B clean test'
                        }
                    }
                }
            }
        }

        stage('Build JARs Backend') {
            steps {
                script {
                    def services = ["Eureka-Server","User-Service","Formation-Service"]
                    for (s in services) {
                        dir("backend/stage-ete-main/${s}") {
                            echo "📦 Building JAR for ${s}"
                            sh 'mvn -B package -DskipTests'
                        }
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withCredentials([string(credentialsId: "${SONAR_CREDENTIALS}", variable: 'SONAR_TOKEN')]) {
                    script {
                        def services = [
                            [name: "eureka-server", path: "Eureka-Server"],
                            [name: "user-service", path: "User-Service"],
                            [name: "formation-service", path: "Formation-Service"]
                        ]
                        for (s in services) {
                            dir("backend/stage-ete-main/${s.path}") {
                                sh """
                                mvn -B sonar:sonar \
                                  -Dsonar.projectKey=${s.name} \
                                  -Dsonar.host.url=${SONAR_HOST} \
                                  -Dsonar.token=${SONAR_TOKEN}
                                """
                            }
                        }
                    }
                }
            }
        }

        stage('Build & Push Docker Images Backend') {
            steps {
                script {
                    def commit = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                    env.IMAGE_TAG = "${commit}-${env.BUILD_NUMBER}".toLowerCase()

                    withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDENTIALS}", usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                        env.DOCKER_USER = "${IMAGE_NAMESPACE}"
                        sh 'echo "$PASS" | docker login -u "$DOCKER_USER" --password-stdin'

                        def services = ["Eureka-Server", "User-Service", "Formation-Service"]
                        for (s in services) {
                            def imageName = s.toLowerCase()
                            sh """
                                docker build --network host \
                                -t $DOCKER_USER/${imageName}:${IMAGE_TAG} \
                                -t $DOCKER_USER/${imageName}:latest \
                                -f backend/stage-ete-main/${s}/Dockerfile \
                                backend/stage-ete-main/${s}

                                docker push $DOCKER_USER/${imageName}:${IMAGE_TAG}
                                docker push $DOCKER_USER/${imageName}:latest
                            """
                        }
                    }
                }
            }
        }

        stage('Build Frontend Angular & Push Docker Image') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDENTIALS}", usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                        sh 'echo "$PASS" | docker login -u "$USER" --password-stdin'

                        dir('frontend/InternshipProject') {
                            echo "🔧 Building Angular frontend"
                            sh '''
                                npm install
                                npm run build --prod
                                docker build -t $USER/frontend:${IMAGE_TAG} -t $USER/frontend:latest .
                                docker push $USER/frontend:${IMAGE_TAG}
                                docker push $USER/frontend:latest
                            '''
                        }
                    }
                }
            }
        }

        // 🧩 Nouveau stage : Déploiement Kubernetes
        stage('Deploy on Kubernetes') {
            steps {
                script {
                    sh '''
                    echo "🚀 Déploiement Kubernetes..."
                    cd backend/stage-ete-main/deploy/k8s

                    # Créer le namespace s’il n’existe pas
                    kubectl get ns esprit-formation || kubectl create ns esprit-formation

                    # Appliquer les manifests
                    kubectl apply -k .

                    # Mettre à jour les images avec le nouveau tag
                    kubectl set image deployment/eureka-server eureka-server=${IMAGE_NAMESPACE}/eureka-server:${IMAGE_TAG} -n esprit-formation || true
                    kubectl set image deployment/user-service user-service=${IMAGE_NAMESPACE}/user-service:${IMAGE_TAG} -n esprit-formation || true
                    kubectl set image deployment/formation-service formation-service=${IMAGE_NAMESPACE}/formation-service:${IMAGE_TAG} -n esprit-formation || true
                    kubectl set image deployment/frontend frontend=${IMAGE_NAMESPACE}/frontend:${IMAGE_TAG} -n esprit-formation || true

                    kubectl rollout status deployment/frontend -n esprit-formation
                    '''
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'backend/stage-ete-main/**/target/*.jar', fingerprint: true
        }
    }
}
