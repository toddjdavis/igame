select * from games 
where title ilike '%' || $1 || '%'
order by title;