update comments
set comment = $1
where comment_id = $2 and user_id = $3;