# Stage 1: Build ứng dụng
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Build ra file .jar (Bỏ qua test để build nhanh)
RUN mvn clean package -DskipTests



# Stage 2: Chạy ứng dụng (Dùng bản Alpine siêu nhẹ)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]