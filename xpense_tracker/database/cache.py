"""Basic connection example.
"""

import redis

r = redis.Redis(
    host='redis-15715.c99.us-east-1-4.ec2.redns.redis-cloud.com',
    port=15715,
    decode_responses=True,
    username="default",
    password="5cWSeTjMMHJyhaoowKrte44By0qCk9x4",
)

success = r.set('foo', 'bar')

result = r.get('foo')
print(result)

