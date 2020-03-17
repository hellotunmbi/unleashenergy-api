const cron = require("node-cron");
const schedule = require("node-schedule");

exports.runScheduler = (req, res) => {
  //   const type = req.body.type;
  //   const cron = cron.schedule("*/2 * * * * *", () => {
  //     console.log("running a task every minute " + type);
  //   });

  //   cron.start();

  let startTime = new Date(Date.now() + 5000);
  let endTime = new Date(startTime.getTime() + 5000);
  var j = schedule.scheduleJob(
    { start: startTime, end: endTime, rule: "* * * * * *" },
    function() {
      console.log("Time for tea!");
    }
  );

  res.json({
    status: 200,
    message: "schedule started"
  });
};
