# [VA Memorial Front End & Back End Hookup](https://www.topcoder.com/challenges/30064770)



### Backend deploy and run

- follow *va-backend/readme.md* make sure you installed postgresql 10.x , node 8.x , npm 5.x, lerna
- make sure there is no database named "vaonline" exist
  -  use `psql -f vaonline.sql postgres` create database and import data , note : vaonline.sql download from forum.
- run `va-backend` , run `lerna bootstrap`
- goto `va-backend/packages/va-rest-api` , run `node integration-test-data.js` to import additional data,
- run `npm start` start server



### Frontend deploy and run

- goto `va-frontend` , and run `npm i`
- run `npm run lint` to check code
- run `npm start` to start frontend
- open http://localhost:3000/



#### Test path

- in */*  and /search page to test search Veterans
- in /dashboard/2, this is veteran details page

  - click "Write Story","Upload","Testimonal","Badge" to create those contents, this content will show in below tabs if status is "Approved".
  - in dashboard tab, click "Read more" to open post details, click "Flag" button near by close button, to create flag request.
- in /setting, this is normal user setting page

  - update his information
  - when user is nok,  he can review nok Veteran posts, and click link on left bottom goto Veteran details.
  - delete your self posts
- in /admin/setting, this is admin setting page
  - you can review flags
  - review NOK request

#### Account

when backend ``node integration-test-data.js` run succeed, two user created

- normal user. email: user@test.com , password: password
- admin user. email: admin@test.com, password: password



### Video

backend deploy and run https://youtu.be/1SHXJzQIQys

frontend  test <https://youtu.be/EZ93_3cGtvk>