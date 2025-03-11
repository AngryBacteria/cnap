# Environment Variables
|         Variable          | Description                                                     | Default         | Required | Type    |
|:-------------------------:|-----------------------------------------------------------------|-----------------|----------|---------|
|         PROD_PORT         | Port number on which the server (frontend and backend) will run | 3000            | no       | Number  |
|         RUN_TASKS         | Boolean flag to enable/disable scheduled background tasks       | false           | no       | Boolean |
|       RIOT_API_KEY        | API key for authenticating Riot Games API requests              | undefined       | yes      | String  |
|      UPDATE_INTERVAL      | Interval in milliseconds between data update cycles             | 3600000 (1hour) | no       | Number  |
| MONGODB_CONNECTION_STRING | MongoDB connection URL for database access                      | undefined       | yes      | Number  |