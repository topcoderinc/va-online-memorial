1. Security.
1.1. Please note, that login endoint was incorrectly documented as to token was returned.
1.2. Please note that update password functionality was implemented incorrectly. There should be method to change the updated password with token (token also added to DB), not only initiate update. Also there should be a method to update the logged in user password.

2. Sorting and paginations.
Sorting was added as well as total number of records, limit and offset to the search responses.

3. Flags 
Flags approach with only referencing the post by id isn't a good idea from the performance standpoint as for each post additional GET request should be performed. The post should be returned as a part of GET /flags.

4. Next of kins appraoch with 2 separate entities was changed, as there's no reason to have 2 entities for this. NOK requests are identified by "Requested" status. Also it wasn't clear when the Kin entity in original architecture will be created. There was an enpoint for it, but user definely doesn't call it, s/he sends requests.

5. Badges. Please note that badges are different from stories and photoes, as it badge of the same type from different users  is considered as one badge: https://marvelapp.com/1399ich6/screen/38470333 . Therefore the statistics should be per badge type, end we shouldn't have the duplicated badges with separate statistics.

6. Lookups. Please note that entities like Branch, War are lookups and should only expose GET API. In the existing code they are implemented as lookups, no need for CUD operations like arch v1.0.

7. PATCH vs PUT. The code uses PUT for update, the code is followed.

8. Notitifiaction preferences. They should be separated from the user account, as there should be a separate endpoint to get/update them.

9. Email. There should be functionality to send emails.

10. Statistics report. There should be functionality to download the statistics report. 

11. Salutes. In order to create Salute for the Story PUT /stories/{id}/salute should be used (same for photos, testimonials, etc). In order to check if the story was saluted by current user, GET /stories/{id}/isSaluted should be called (same for photos, testimonials, etc). PUT /stories/{id}/salute will create a record in PostSalutes table.