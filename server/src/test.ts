import dbh from "./helpers/DBHelper.js";
import {CollectionName} from "./model/Database.js";

const members = await dbh.genericGet(CollectionName.MEMBER, {limit: 10000})
console.log(members.data[0]._id)

for (const member of members.data) {
    const objectId = member._id;
    const newSummoners = member.leagueSummoners.map((summoner) => {
        return {
            ...summoner,
            memberId: objectId,
        };
    })

    await dbh.genericUpsert(newSummoners, "puuid", CollectionName.SUMMONER)
}