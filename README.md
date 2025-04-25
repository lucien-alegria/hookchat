# Welcome to hookchat

Hookchat is a UI for chatting on the fly with a webhook. 

## Project info

Payload sent to the webhook:

```json
{
        "message": "Hey!",
        "threadId": "9759cee0-e11f-4779-b695-bff18bdb15af",
        "timestamp": 1745410377299,
        "attachmentCount": 1,
        "attachments": [
            {
                "attachmentName": "fileName",
                "attachmentMime": "application/pdf",
                "attachmentData": "12345"
            }
        ]
    }
```

Expected response:

```json
{
    "response": "Hello! How can I assist you today?",
    "threadId": "9759cee0-e11f-4779-b695-bff18bdb15af"
    }
```

## How can I get my own hookchat?

Feel free to duplicate this application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/f3d2b692-0341-48c9-914e-2c5a4e10459b) and start prompting.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
