SELECT schemaname,relname,n_live_tup
  FROM pg_stat_user_tables
  ORDER BY n_live_tup DESC;



 --  schemaname |    relname    | n_live_tup
 -- ------------+---------------+------------
 --  public     | VeteranWar    |    1416946
 --  public     | VeteranBranch |    1321561
 --  public     | Veterans      |    1311435
 --  public     | Kins          |    1311195
 --  public     | Burials       |    1310093
 --  public     | VeteranRank   |    1309348
 --  public     | Ranks         |      15394
 --  public     | Branches      |         74
 --
 --  public     | Cemeteries    |         44
 --  public     | Wars          |         21
