# Core Service Documentation

## API Documentation

| Module | Documentation |
|--------|---------------|
| Users | [Users API](./src/api/users/README.md) |
| Events | [Events API](./src/api/events/README.md) |
| Stories | [Stories API](./src/api/stories/README.md) |
| Partners | [Partners API](./src/api/partners/README.md) |
| Galery | [Galery API](./src/api/galery/README.md) |

## Project Structure

```
/core_service
├── src/
│   ├── api/              # API modules
│   │   ├── users/        # User management
│   │   ├── events/       # Events management
│   │   ├── stories/      # Stories management
│   │   ├── partners/     # Partners management
│   │   └── galery/       # Gallery management
│   ├── core/             # Core functionality
│   │   ├── config/       # Configuration
│   │   ├── db/           # Database
│   │   └── logger/       # Logging
│   └── main.py           # Application entry point
├── requirements.txt      # Python dependencies
├── Dockerfile            # Docker configuration
└── .env_example          # Environment variables template
```

## Environment Variables

Create a `.env` file based on `.env_example` and configure the following variables:

| Variable | Description |
|----------|-------------|
| `JWT_SECRET_KEY` | Secret key for JWT token signing |
| `ADMIN_EMAIL` | Email for the default admin user |
| `ADMIN_PASSWORD` | Password for the default admin user |
| `ADMIN_NAME` | Name for the default admin user |
| `ADMIN_SURNAME` | Surname for the default admin user |
| `ENV_TYPE` | Environment type: `dev` or `prod` |
| `PG_HOST` | PostgreSQL database host |
| `PG_PORT` | PostgreSQL database port |
| `PG_USER` | PostgreSQL database user |
| `PG_PASSWORD` | PostgreSQL database password |
| `PG_DB` | PostgreSQL database name |
| `APP_PORT` | Application port (default: 8000) |

## Running the Application

### Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run the application
python src/main.py
```

### Using Docker

```bash
# Build the Docker image
docker build -t core-service .

# Run the container
docker run -p 8000:8000 --env-file .env core-service
```

## API Endpoints Overview

### Authentication
- `POST /users/login` - User login
- `POST /users/register` - User registration
- `GET /users/auth` - Validate token

### Users
- `GET /users/get_info` - Get current user info
- `GET /users/all` - Get all users (admin only)

### Events
- `POST /events/new` - Create event (admin only)
- `GET /events/` - Get events list
- `PATCH /events/{event_id}` - Update event (admin only)
- `DELETE /events/delete/{event_id}` - Delete event (admin only)

### Stories
- `GET /stories/tags` - Get all tags
- `POST /stories/new_tag` - Create tag (admin only)
- `GET /stories/requests` - Get story requests (admin only)
- `POST /stories/new` - Create story
- `PATCH /stories/status` - Change story status (admin only)

### Partners
- `GET /partners/` - Get all partners
- `POST /partners/new` - Create partner (admin only)
- `DELETE /partners/{partner_id}` - Delete partner (admin only)
- `PATCH /partners/{partner_id}` - Update partner (admin only)

### Gallery
- `GET /galery/` - Get published photos
- `POST /galery/add` - Add photos
- `GET /galery/requests` - Get publication requests (admin only)
- `PATCH /galery/status` - Update publication status (admin only)
- `DELETE /galery/photo` - Delete publication photo (admin only)

## Health Check

- `GET /health` - Check application health

## Static Files

Static files (images) are served from `/static` endpoint.
