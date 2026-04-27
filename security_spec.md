# Security Specification - Vault Earning App

## 1. Data Invariants
- A user profile must match the authenticated UID.
- Balance can only be non-negative.
- Users can only read their own profile, withdrawal requests, and the public tasks list.
- Only the hardcoded admin (yashchate63@gmail.com) can manage tasks and all withdrawal requests.
- Withdrawal requests must start with 'Pending' status.
- Timestamps must be server-generated.

## 2. The "Dirty Dozen" Payloads (Red Team Test Cases)

1. **Identity Spoofing**: Create a user document with a different target UID.
   - `setDoc(doc(db, 'users', 'victim-uid'), { uid: 'victim-uid', balance: 1000 })`
2. **Balance Injection**: Create a user with a non-zero starting balance.
   - `setDoc(doc(db, 'users', 'my-uid'), { uid: 'my-uid', balance: 99999 })`
3. **Task Hijacking**: Update a task's reward as a regular user.
   - `updateDoc(doc(db, 'tasks', 'task-1'), { reward: 100000 })`
4. **Illegal Withdrawal Status**: Create a withdrawal request as 'Completed'.
   - `addDoc(collection(db, 'withdrawalRequests'), { status: 'Completed', amount: 100, userId: 'my-uid' })`
5. **PII Scraping**: Attempt to list all users.
   - `getDocs(collection(db, 'users'))`
6. **Withdrawal Interception**: Update someone else's withdrawal request.
   - `updateDoc(doc(db, 'withdrawalRequests', 'someone-else-req'), { userId: 'my-uid' })`
7. **Negative Balance**: Set balance to negative via withdrawal.
   - `updateDoc(doc(db, 'users', 'my-uid'), { balance: -500 })`
8. **Token Forgery**: Using a fake email verified claim (Rules should check `auth.token.email_verified`).
9. **Id Poisoning**: Using a massive string as a document ID.
   - `setDoc(doc(db, 'users', 'A'.repeat(2000)), { ... })`
10. **State Shortcutting**: Skipping 'Pending' and moving straight to 'Completed' for own withdrawal (if rules allowed user update).
11. **Shadow Update**: Adding `isAdmin: true` to user metadata.
12. **Recursive Cost Attack**: Making unauthorized list queries without where clauses.

## 3. Test Runner (Mock)
(Tests would verify PERMISSION_DENIED for above)
