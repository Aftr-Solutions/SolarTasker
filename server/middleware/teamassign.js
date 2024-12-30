const pool = require("../Utils/db");
const tableName = require("../Utils/allTableNames");

const assignteam = async () => {
  try {
    const query = `
      SELECT id 
      FROM ${tableName.tasks} 
      WHERE isactive = 0 AND team_id IS NULL;
    `;

    // Get a connection from the pool
    const connection = await new Promise((resolve, reject) => {
      pool.getConnection((err, conn) => {
        if (err) reject(err);
        else resolve(conn);
      });
    });

    try {
      // Fetch unassigned tasks
      const tasks = await new Promise((resolve, reject) => {
        connection.query(query, (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });

      const taskIds = tasks.map((row) => row.id); // Get task IDs
      const taskCount = taskIds.length;

      if (taskCount > 0) {
        const teamQuery = `
          SELECT id 
          FROM ${tableName.team} 
          WHERE isactive = 0;
        `;

        // Fetch all active teams
        const teams = await new Promise((resolve, reject) => {
          connection.query(teamQuery, (err, results) => {
            if (err) reject(err);
            else resolve(results);
          });
        });

        const teamIds = teams.map((row) => row.id); // Get team IDs
        const availableTeams = teamIds.length;

        if (availableTeams > 0) {
          console.log(
            `Assigning ${taskCount} tasks to ${availableTeams} teams...`
          );

          // Initialize task counters for each team
          const teamTaskCount = Array(availableTeams).fill(0);

          let teamIndex = 0; // Initialize teamIndex

          // Round-robin task assignment
          for (const taskId of taskIds) {
            let attempts = 0;

            // Find a team with less than 5 tasks
            while (teamTaskCount[teamIndex] >= 5 && attempts < availableTeams) {
              teamIndex = (teamIndex + 1) % availableTeams;
              attempts++;
            }

            if (attempts === availableTeams) {
              console.log(
                `Task ${taskId} could not be assigned as all teams have reached the maximum limit of 5 tasks.`
              );
              continue;
            }

            const teamId = teamIds[teamIndex];
            const assignQuery = `
              UPDATE ${tableName.tasks} 
              SET team_id = ${teamId} 
              WHERE id = ${taskId};
            `;

            // Perform the assignment
            await new Promise((resolve, reject) => {
              connection.query(assignQuery, (err) => {
                if (err) {
                  console.error(
                    `Error assigning task ${taskId} to team ${teamId}:`,
                    err
                  );
                  reject(err);
                } else {
                  teamTaskCount[teamIndex]++; // Increment the count for the team
                  console.log(
                    `Task ${taskId} assigned to Team ${teamId} (Tasks assigned: ${teamTaskCount[teamIndex]})`
                  );
                  resolve();
                }
              });
            });

            // Move to the next team
            teamIndex = (teamIndex + 1) % availableTeams;
          }
        } else {
          console.log("No teams available. Tasks will remain unassigned.");
        }
      } else {
        console.log("No tasks with upcoming services.");
      }
    } finally {
      connection.release(); // Ensure the connection is released
    }
  } catch (error) {
    console.error("Error in assignteam function:", error.message);
  }
};

module.exports = { assignteam };
