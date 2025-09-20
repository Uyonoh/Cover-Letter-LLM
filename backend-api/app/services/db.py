from supabase import create_client, Client
import os

# Initialize Supabase client
def get_supabase_client():
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    supabase: Client = create_client(url, key)

    return supabase

def get_service_client():
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_KEY")
    supabase: Client = create_client(url, key)

    return supabase


from typing import Dict, Any, Type, Callable
from app.services.encryption import hash_password
from datetime import datetime
import uuid

# _Table = Dict[str, Any]
_Table = Dict[str, list[Any]] #supabase style tables

class PseudoSet(list):
    def __init__(self, *args, **kwargs):
        return super().__init__(*args, **kwargs)
    
    @property
    def data(self):
        return self

class QuerySet:
    def __init__(self, data: Dict[str, list[Any]]):
        self.data = data
    
    def select(self, columns: str|list):
        if isinstance(columns, str):
            if columns == "*":
                return self
            else:
                columns = [columns]
        elif isinstance(columns, list):
            data = {}
            for column in columns:
                if column in self.data:
                    data[column] = self.data[column]
                else:
                    raise KeyError(f"Column {column} does not exist")
            self.data = data
            return self
        else:
            raise TypeError(f"columns must be a string or list, not {type(columns)}")
    
    def eq(self, column: str, value: Any):
        idxs = []
        column: list = self.data[column].copy()
        while True:
            try:
                idx = column.index(value)
                column[idx] = ""
                idxs.append(idx)
            except ValueError:
                break        
        data = {key: [self.data[key][idx] for idx in idxs] for key in self.data}
        self.data = data
        self.idxs = idxs
        return self
    
    def execute(self) -> list[_Table]:
        data = PseudoSet()
        keys = list(self.data.keys())
        n = len(self.data.get(keys[0]))
        
        for i in range(n):
            data.append({
                key: self.data.get(key)[i] for key in keys
            })
        return data
        

class Table:
    
    def __init__(self, name: str, schema: Dict[str, Type|list[Type, Callable]]):
        self.name = name
        self.schema: Dict[str, Type|list[Type, Callable]] = {"id": int}
        self.schema.update(schema)
        self.data = {key:[] for key in self.schema}
        self.last_id = -1


    def validate_types(self, data: dict[str, Any]) -> None:
        for key, value in data.items():
            if key in self.schema:
                data_type = self.schema.get(key)
                if isinstance(data_type, list):
                    data_type = data_type[0]
                if isinstance(value, data_type):
                    pass
                else:
                    raise TypeError(f"{key} must be a {data_type}")
            else:
                raise KeyError(f"Table {self.name} does not have a column {key}")
            
    def insert(self, data: dict[str, Any]):
        self.validate_types(data)
        try:
            if not "id" in data.keys():
                id = self.last_id + 1
                self.data["id"].append(id)
                self.last_id = id

            for key, value in data.items():
                self.data[key].append(value)
            for key, value in self.schema.items():
                if isinstance(value, list) and not key in data.keys():
                    x = value[1]()
                    if not isinstance(x, value[0]):
                        x = value[0](x) # convert to appropriate type
                    self.data[key].append(x)
            return QuerySet(self.data)
        except Exception as e:
            raise RuntimeError(f"Unexpected insert error:\n{e}")
    
    def select(self, columns: str|list):
        queryset = QuerySet(self.data)
        queryset = queryset.select(columns)

        return queryset

class Supatab:
    """ A basic offline working version of the supabase client """

    def __init__(self):
        self.tables: Dict[str, Table] = {}

    def create_client(self):
        return None
    
    def create_table(self, name: str, schema: Dict[str, Type|list[Type, Callable]]):
        try:
            self.tables[name] = Table(name, schema)
        except Exception:
            raise TypeError("Invalid table parameters")

    def table(self, table: str) -> Table:
        try:
            table = self.tables[table]
            return table
        except KeyError:
            raise KeyError(f"Table {table} does not exist in database")

def create_test():
    db = Supatab()
    db.create_table("users", {"user_id": [uuid.UUID, uuid.uuid4],               "email": str,                 "hashed_password": str})
    db.table("users").insert({"email": "john@example.com",  "hashed_password": hash_password("password123")})
    
    def default_uid():
        return db.table("users").select("*").execute()[0].get("user_id")
    
    db.create_table("letters", {
        "user_id": [uuid.UUID, default_uid],
        "content": str,
        "job_description": str,
        "created_at": [str, datetime.now().isoformat]
        })
    return db

# supabase = create_test()
# print(supabase.table("users").select("*").execute())
# supabase.table("users").select("*").eq("email", "jane@example.com")