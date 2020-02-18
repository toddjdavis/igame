insert into messages (
    chatroom_id,
    user_id,
    message,
    email
) values (
    $1, $2, $3, $4
)
returning *;