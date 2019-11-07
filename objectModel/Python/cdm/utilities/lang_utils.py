
def isfunction(obj, func) -> bool:
    """Checks if the given object has a function with the given name"""
    if obj is None or not func:
        return False
    func_ref = getattr(obj, func, None)
    return callable(func_ref)
