# Testing Guide - AI Chat Todo Manager

## Quick Start Testing

### 1. Start Backend Server

Open Terminal 1:
```bash
cd backend
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Application startup complete.
```

**Verify Backend:**
- Visit http://localhost:8000 - Should show API info
- Visit http://localhost:8000/docs - Should show Swagger UI
- Visit http://localhost:8000/health - Should show database status

---

### 2. Start Frontend Server

Open Terminal 2:
```bash
cd frontend
npm run dev
```

**Expected Output:**
```
> frontend@0.1.0 dev
> next dev

   ▲ Next.js 14.x
   - Local:        http://localhost:3000
   - Ready in 2.5s
```

**Verify Frontend:**
- Visit http://localhost:3000 - Should show landing page

---

## Testing Checklist

### ✅ Phase 1: Authentication Flow

1. **Register New User**
   - Go to http://localhost:3000/register
   - Fill in: Email, Password, First Name, Last Name
   - Click "Sign Up"
   - Should redirect to login page

2. **Login**
   - Go to http://localhost:3000/login
   - Enter email and password
   - Click "Sign In"
   - Should redirect to /dashboard or /chat

---

### ✅ Phase 2: AI Chat Functionality (MVP)

3. **Access Chat Interface**
   - Navigate to http://localhost:3000/chat
   - Should see:
     - Chat interface with message input
     - "New Chat" button
     - Conversation list sidebar (if enabled)

4. **Test Natural Language Commands**

   **Test 1: Create a Task**
   ```
   User: "remind me to buy groceries"
   Expected AI Response: "I've created a task to buy groceries for you."
   ```

   **Test 2: List Tasks**
   ```
   User: "show my tasks"
   Expected AI Response: List of all your tasks with IDs
   ```

   **Test 3: Complete a Task**
   ```
   User: "complete task 1"
   Expected AI Response: "I've marked task 1 as complete."
   ```

   **Test 4: Update a Task**
   ```
   User: "update task 2 to call the dentist tomorrow"
   Expected AI Response: "I've updated task 2."
   ```

   **Test 5: Delete a Task**
   ```
   User: "delete task 3"
   Expected AI Response: "I've deleted task 3."
   ```

5. **Verify MCP Tools Execution**
   - Check backend terminal for logs like:
     ```
     [STEP 6] Executing MCP tool: add_task with args: {...}
     [STEP 6] Tool add_task executed successfully
     ```

---

### ✅ Phase 3: Conversation Persistence

6. **Create Multiple Messages**
   - Send 3-5 messages in one conversation
   - Verify each message appears in chat
   - Check conversation ID in header

7. **Start New Conversation**
   - Click "New Chat" button
   - Send a message
   - Verify new conversation ID is different

8. **Switch Between Conversations**
   - Open conversation list sidebar (if hidden, click "Show Conversations")
   - Click on previous conversation
   - Verify full message history loads
   - Messages should be in correct order

9. **Test Conversation History Loading**
   - Refresh the page (F5)
   - Verify you're still in the same conversation
   - Verify all messages are still visible

---

### ✅ Phase 4: Error Handling

10. **Test Invalid OpenAI Key** (Optional)
    - Temporarily set wrong OPENAI_API_KEY in .env
    - Restart backend
    - Try sending message
    - Should see error: "AI service unavailable"
    - Restore correct key and restart

11. **Test Rate Limiting** (Optional)
    - Send 100+ messages rapidly
    - Should eventually see: "Rate limit exceeded"

12. **Test Offline Behavior**
    - Stop backend server
    - Try sending message in frontend
    - Should see error message
    - Restart backend
    - Should reconnect automatically

---

### ✅ Phase 5: UI/UX Testing

13. **Check Responsive Design**
    - Resize browser window to mobile size (320px width)
    - Verify no horizontal scroll
    - Verify buttons are touch-friendly (min 44px)
    - Check tablet size (768px)
    - Check desktop size (1024px+)

14. **Test Loading States**
    - Send a message
    - Verify loading indicator appears
    - Verify typing indicator shows (if implemented)
    - Verify smooth animations

15. **Test Gradient Background**
    - Verify gradient background on all pages
    - Check card shadows and rounded corners
    - Verify consistent spacing

---

### ✅ Phase 6: Database Verification

16. **Check Database Tables**
    ```bash
    # Connect to your database
    psql $DATABASE_URL

    # List tables
    \dt

    # Should see: users, tasks, conversations, messages

    # Check task schema
    \d tasks

    # Should show: id (integer), user_id (varchar), title, description, completed, created_at, updated_at
    ```

17. **Verify User Isolation**
    - Create second user account
    - Login as user 2
    - Send message to create task
    - Login back as user 1
    - Verify you only see your own tasks

---

## API Testing (Advanced)

### Test Chat API Directly

```bash
# Get auth token first (replace with your credentials)
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "yourpassword"}'

# Use the token from response
export TOKEN="your-jwt-token-here"

# Test chat endpoint
curl -X POST http://localhost:8000/api/user123/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "conversation_id": null,
    "message": "add task to buy milk"
  }'

# Expected response:
# {
#   "conversation_id": 1,
#   "response": "I've created a task...",
#   "tool_calls": [...]
# }
```

### Test Conversation Listing

```bash
curl -X GET http://localhost:8000/api/user123/conversations \
  -H "Authorization: Bearer $TOKEN"

# Expected response:
# {
#   "conversations": [
#     {
#       "id": 1,
#       "created_at": "2026-02-16T...",
#       "updated_at": "2026-02-16T...",
#       "message_count": 5
#     }
#   ]
# }
```

---

## Performance Testing

### Load Testing (Optional)

```bash
# Install apache bench
# Test chat endpoint with 100 concurrent requests
ab -n 100 -c 10 -H "Authorization: Bearer $TOKEN" \
   -p message.json \
   -T application/json \
   http://localhost:8000/api/user123/chat

# message.json:
# {"conversation_id": null, "message": "test"}
```

---

## Troubleshooting

### Backend Won't Start

**Check 1: Database Connection**
```python
python -c "
import os
from dotenv import load_dotenv
load_dotenv()
import psycopg2
conn = psycopg2.connect(os.getenv('DATABASE_URL'))
print('Database connection: OK')
"
```

**Check 2: OpenAI API Key**
```python
python -c "
import os
from dotenv import load_dotenv
load_dotenv()
print('OPENAI_API_KEY:', 'SET' if os.getenv('OPENAI_API_KEY') else 'MISSING')
"
```

**Check 3: Port in Use**
```bash
# Windows
netstat -ano | findstr :8000

# Kill process if needed
taskkill /PID <process_id> /F
```

---

### Frontend Won't Start

**Check 1: Node Modules**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Check 2: Environment Variables**
```bash
# Verify .env.local exists
cat .env.local

# Should contain:
# NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

---

### Chat Not Working

**Check 1: Backend Logs**
- Look for errors in backend terminal
- Should see "[STEP X]" messages for each request

**Check 2: Browser Console**
- Open DevTools (F12)
- Check Console tab for errors
- Check Network tab for failed requests

**Check 3: CORS Issues**
- Backend should allow http://localhost:3000
- Check main.py CORS configuration

---

## Success Criteria

### ✅ All Tests Pass When:

1. **Authentication**: Can register, login, logout
2. **AI Chat**: Can create, list, complete, update, delete tasks via chat
3. **Conversations**: Can create, switch, and load conversation history
4. **UI**: Responsive, no errors, smooth animations
5. **Database**: Tables exist, schema matches constitution
6. **Security**: Rate limiting works, user isolation enforced
7. **Performance**: Chat responds in < 5 seconds

---

## Next Steps After Testing

1. ✅ **All tests pass** → Deploy to production
2. ⚠️ **Some tests fail** → Check troubleshooting section
3. 🐛 **Found bugs** → Report issues with error logs

---

## Support

If you encounter issues:
1. Check backend and frontend terminal logs
2. Review troubleshooting section
3. Check database connection
4. Verify environment variables
5. Test API endpoints directly with curl

**Happy Testing! 🎉**
