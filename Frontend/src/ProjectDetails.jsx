const handleCreate = async () => {
    if (!projectTitle || !briefDescription || !projectType || !subjectArea || !deadline) {
      setError("Please fill in all required fields.");
      return;
    }
  
    // Ensure price is at least $7
    if (price < 7) {
      setPriceError("The price must be at least $7.");
      return;
    }
  
    // Reset price error
    setPriceError("");
  
    // Get the userID from localStorage
    const userID = localStorage.getItem("userID");
  
    // If userID is not found in localStorage, show error
    if (!userID) {
      setError("User not logged in. Please log in first.");
      return;
    }
  
    // Log the userID to make sure it's being retrieved correctly
    console.log("User ID:", userID);
  
    // Prepare the form data to send to the backend
    const formData = new FormData();
    formData.append("projectTitle", projectTitle);
    formData.append("briefDescription", briefDescription);
    formData.append("projectType", projectType);
    formData.append("subjectArea", subjectArea);
    formData.append("deadline", deadline);
    formData.append("autoMatch", autoMatch);
    formData.append("price", price);
    formData.append("pages", pages);
    formData.append("userID", userID); // Add userID to the form data
  
    // Append the attachments (multiple files)
    attachments.forEach((file) => {
      formData.append("attachments", file);
    });
  
    try {
      // Send the data to the backend (assuming the backend is expecting the form data)
      const response = await axios.post("http://localhost:5000/api/projects", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      alert("Project Created Successfully!");
      setIsWriterSearch(true); // Switch to WriterSearch after project creation
    } catch (error) {
      // Log the error to understand what went wrong
      console.error("Error creating project:", error.response || error.message);
      setError("An error occurred while creating the project. Please try again.");
    }
  };
  