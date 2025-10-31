from fastapi.responses import JSONResponse
from app.models.schemas.response import ResponseModel, ResponseErrors

def success_response(data=None, message: str = "Success", status_code: int = 200):
    return JSONResponse(
        status_code=status_code,
        content=ResponseModel(status="success", message=message, data=data).model_dump()
    )

def error_response(message: str, error_code: str = "ERROR", status_code: int = 400, details=None):
    return JSONResponse(
        status_code=status_code,
        content=ResponseModel(
            status="error",
            message=message,
            error_code=error_code,
            details=details
        ).model_dump()
    )

RESPONSE_ERRORS = ResponseErrors