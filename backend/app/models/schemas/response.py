from pydantic import BaseModel
from typing import Any, Optional
from enum import StrEnum

# Class to store application response error constants
class ResponseErrors (StrEnum):
    """Standard Response Errors """
    VALIDATION_ERROR = "VALIDATION_ERROR"  # Error related to input validation
    NOT_FOUND_ERROR = "NOT_FOUND"                # Error when a resource is not found
    SERVER_ERROR = "SERVER_ERROR"          # Generic server error
    UNAUTHORIZED_ERROR = "UNAUTHORIZED"          # Error for unauthenticated access
    FORBIDDEN_ERROR = "FORBIDDEN"                # Error for forbidden actions
    CONFLICT_ERROR = "CONFLICT"                  # Error when a resource conflict occurs
    TIMEOUT_ERROR = "TIMEOUT"                    # Error for request timeouts
    BAD_REQUEST_ERROR = "BAD_REQUEST"            # Error for malformed requests
    UNKNOWN_ERROR = "UNKNOWN_ERROR"

    def __init__(self):
        super().__init__()

def get_all_error_codes():
    return [value for key, value in ResponseErrors.__dict__.items() if not key.startswith("__")]

class ResponseModel(BaseModel):
    status: str  # "success" | "error"
    message: Optional[str] = None
    data: Optional[Any] = None
    error_code: Optional[str] = None  # e.g. "VALIDATION_ERROR", "NOT_FOUND", "SERVER_ERROR", "AUTHORIZATION_ERROR"
    details: Optional[Any] = None     # for debugging or validation errors
