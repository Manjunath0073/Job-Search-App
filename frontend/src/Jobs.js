import { useEffect, useState } from "react";
import axios from "axios";

function Jobs() {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:3001/jobs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJobs(response.data);
    } catch (err) {
      alert("Failed to fetch jobs");
    }
  };

  const applyJob = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:3001/apply/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Applied successfully");
    } catch (err) {
      alert("Apply failed");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div>
      <h2>Jobs</h2>

      {jobs.map((job) => (
        <div key={job.id} style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
          <h3>{job.title}</h3>
          <p>{job.company}</p>
          <p>{job.location}</p>
          <p>{job.salary}</p>
          <button onClick={() => applyJob(job.id)}>Apply</button>
        </div>
      ))}
    </div>
  );
}

export default Jobs;