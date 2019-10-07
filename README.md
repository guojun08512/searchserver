## version
```
request({
    uri: `${host}/version`,
    method: 'GET',
})

response ->
{
    body: {
        version,
        code,
        message,
        data,
    }
}
```
## Login
```
request({
    uri: `${host}/v1/users/login`,
    method: 'POST',
    body: {
        username,
        password
    }
})

response ->
{
    body: {
        version,
        code,
        message,
        data: {
            token,
            realName,
            roles: [...]
        }
    }
}
1001: 'Access token is invalid.'
1002: 'Access denied.'
1003: 'User is not found.'
1004: 'User and password do not match.'
```
## Search
#### Search suggestion
```
request({
    uri: `${host}/v1/searchs/searchsuggestion`,
    method: 'POST',
    headers:{
        Authorization: 'Bearer xxxxxxxxx',
    }
    body: {
        search,    //search word
        limit,     //查询范围(0~limit)
    }
})

response ->
{
    body: {
        version,
        code,
        message,
        data:
        {
            suggestions: [],
        }
}
```