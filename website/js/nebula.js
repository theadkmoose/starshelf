fetch("books.json")
  .then(response => response.json())
  .then(books => {
    const container = document.getElementById("nebulaBooks");
    const filter = document.getElementById("statusFilter");
    const nebulaBooks = books.filter(book => (book.award_summary || "").toLowerCase().includes("nebula"));

    function render(selectedStatus) {
      container.innerHTML = "";

      const filtered = nebulaBooks.filter(book => {
        const awardSummary = book.award_summary || "";
        if (selectedStatus === "all") return true;
        return awardSummary.toLowerCase().includes(selectedStatus.toLowerCase());
      });

      if (filtered.length === 0) {
        container.innerHTML = "<p>No Nebula records found.</p>";
        return;
      }

      filtered.forEach(book => {
        container.innerHTML += `
          <div class="book">
            <h2>${book.title}</h2>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Year:</strong> ${book.year || "N/A"}</p>
            <p><strong>Award / Status:</strong> ${book.award_summary || "None"}</p>
          </div>
        `;
      });
    }

    filter.addEventListener("change", event => {
      render(event.target.value);
    });

    render("all");
  })
  .catch(error => {
    console.error("Error loading Nebula data:", error);
    document.getElementById("nebulaBooks").innerHTML = "<p>Unable to load Nebula data.</p>";
  });
