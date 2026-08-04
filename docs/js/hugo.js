fetch("books.json")
  .then(response => response.json())
  .then(books => {
    const container = document.getElementById("hugoBooks");
    const filter = document.getElementById("statusFilter");
    const hugoBooks = books.filter(book => (book.award_summary || "").toLowerCase().includes("hugo"));

    function render(selectedStatus) {
      container.innerHTML = "";

      const filtered = hugoBooks.filter(book => {
        const awardSummary = book.award_summary || "";
        if (selectedStatus === "all") return true;
        return awardSummary.toLowerCase().includes(selectedStatus.toLowerCase());
      });

      if (filtered.length === 0) {
        container.innerHTML = "<p>No Hugo records found.</p>";
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
    console.error("Error loading Hugo data:", error);
    document.getElementById("hugoBooks").innerHTML = "<p>Unable to load Hugo data.</p>";
  });
