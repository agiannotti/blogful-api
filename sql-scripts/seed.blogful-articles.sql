-- truncate clears table; useful for seeding
TRUNCATE blogful_articles;
INSERT INTO blogful_articles
  (title, content)
  VALUES
    ('Blog 1', 'this is a blog'),
    ('Blog 2', 'this is a blog'),
    ('Blog 3', 'this is a blog'),
    ('Blog 4', 'this is a blog'),
    ('Blog 5', 'this is a blog'),
    ('Blog 6', 'this is a blog');
