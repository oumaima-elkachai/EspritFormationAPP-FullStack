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

        stage('Unit Tests') {
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

        stage('Build JARs') {
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

        stage('Build & Push Docker Images') {
            steps {
                script {
                    def commit = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                    env.IMAGE_TAG = "${commit}-${env.BUILD_NUMBER}".toLowerCase()

                    withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDENTIALS}", usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                        echo "Docker login avec USER=${USER}"  
                        env.DOCKER_USER = "oumaimakachai"
                        sh 'echo "$PASS" | docker login -u "$DOCKER_USER" --password-stdin'

                        def services = ["Eureka-Server", "User-Service", "Formation-Service"]
                        for (s in services) {
                            def imageName = s.toLowerCase()
                            sh """
                                docker build --network host \
                                --build-arg MAVEN_OPTS='-Dmaven.repo.local=/root/.m2/repository' \
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

        stage('Deploy via Docker Compose') {
            steps {
                script {
                    sh '''
                    echo "IMAGE_TAG=${IMAGE_TAG}" > backend/stage-ete-main/deploy/.env
                    echo "DOCKER_USER=${DOCKER_USER}" >> backend/stage-ete-main/deploy/.env
                    cd backend/stage-ete-main/deploy
                    docker compose pull || true
                    docker compose up -d --remove-orphans
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
