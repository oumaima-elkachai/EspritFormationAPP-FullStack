# Étape 1 : Build avec Maven
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app

# Debugging DNS resolution
RUN nslookup repo.maven.apache.org || echo "DNS resolution failed"

COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Étape 2 : Image finale
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

ENV SERVER_PORT=8761 \
    SPRING_APPLICATION_NAME=EurekaServer \
    EUREKA_CLIENT_REGISTER_WITH_EUREKA=false \
    EUREKA_CLIENT_FETCH_REGISTRY=false

EXPOSE 8761
ENTRYPOINT ["java","-jar","app.jar"]