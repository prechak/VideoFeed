import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Form, Row, Col, Card } from "react-bootstrap";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

const supabaseUrl = "https://wiwoqzedzjnyoygnvcjk.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indpd29xemVkempueW95Z252Y2prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE1MTA3MzIsImV4cCI6MjAzNzA4NjczMn0.4cTR_-O0HAp7eXOz6xpg-8_JbqVg2wiawMLfLdyI7JM";

const supabase = createClient(supabaseUrl, supabaseKey);

const CDNURL =
  "https://wiwoqzedzjnyoygnvcjk.supabase.co/storage/v1/object/public/videos/";

function App() {
  const [videos, setVideos] = useState([]);

  async function getVideos() {
    const { data, error } = await supabase.storage.from("videos").list("");

    if (data !== null) {
      setVideos(data);
    } else {
      alert("Error grabbing files from supabase");
    }
  }

  useEffect(() => {
    getVideos();
  }, []);

  async function uploadFile(e) {
    const videoFile = e.target.files[0];
    console.log("Upload!");
    const { error } = await supabase.storage
      .from("videos")
      .upload(uuidv4() + ".mp4", videoFile);
    if (error) {
      console.log(error);
      alert("Error uploading file to supabase");
    } else {
      alert("File uploaded successfully");
    }
    getVideos();
  }

  // console.log(videos);

  return (
    <>
      <Container
        className="mt-5"
        style={{ marginTop: "-30rem", width: "700px" }}
      >
        <h1>VideoFeed</h1>
        <Form.Group className="mb-3 mt-3">
          <Form.Label>Upload your video here!</Form.Label>
          <Form.Control
            type="file"
            accept="video/mp4"
            onChange={(e) => uploadFile(e)}
          />
        </Form.Group>
        <Row xs={1} className="g-4">
          {videos.map((video, index) => {
            return (
              <Col key={index}>
                <Card>
                  <video height="300px" autoPlay muted controls>
                    <source src={CDNURL + video.name} type="video/mp4" />
                  </video>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
}

export default App;
