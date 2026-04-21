FROM node:18-alpine
WORKDIR /app
COPY . .
# 패키지 설치 (파일이 있을 때만)
RUN if [ -f package.json ]; then npm install; fi
CMD ["npm", "start"]