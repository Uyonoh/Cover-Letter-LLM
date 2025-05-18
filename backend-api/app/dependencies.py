from fastapi import Depends
from app.utils.security import verify_supabase_token
from typing import Annotated

# Common dependency for all protected routes
CurrentUser = Annotated[dict, Depends(verify_supabase_token)]