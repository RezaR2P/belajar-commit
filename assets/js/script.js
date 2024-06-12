document.addEventListener("DOMContentLoaded", () => {
  let editRow = null;

  // Load data from Local Storage
  loadTableData();

  // Event listener for form submission
  document.querySelector("#contact").addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("nama").value;
    const email = document.getElementById("email").value;
    const number = document.getElementById("number").value;
    const comment = document.getElementById("komentar").value;

    if (validateForm(email, number)) {
      if (editRow === null) {
        addRow(name, email, number, comment);
        saveToLocalStorage(name, email, number, comment);
      } else {
        updateRow(name, email, number, comment);
        updateLocalStorage(editRow, name, email, number, comment);
      }

      document.querySelector("#contact").reset();
      editRow = null;
    }
  });

  const validateForm = (email, number) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const numberPattern = /^\d{12,}$/;

    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return false;
    }

    if (!numberPattern.test(number)) {
      alert("Please enter a valid phone number with at least 12 digits.");
      return false;
    }

    return true;
  };

  const addRow = (name, email, number, comment) => {
    const table = document
      .getElementById("services")
      .getElementsByTagName("tbody")[0];
    const newRow = table.insertRow();

    newRow.insertCell(0).textContent = name;
    newRow.insertCell(1).textContent = email;
    newRow.insertCell(2).textContent = number;
    newRow.insertCell(3).textContent = comment;
    const actions = newRow.insertCell(4);
    actions.appendChild(createEditButton());
    actions.appendChild(createDeleteButton());
  };

  const createEditButton = () => {
    const btn = document.createElement("button");
    btn.className = "btn btn-primary btn-sm mr-2";
    btn.textContent = "Edit";
    btn.addEventListener("click", onEdit);
    return btn;
  };

  const createDeleteButton = () => {
    const btn = document.createElement("button");
    btn.className = "btn btn-danger btn-sm";
    btn.textContent = "Delete";
    btn.addEventListener("click", onDelete);
    return btn;
  };

  const onEdit = (e) => {
    const row = e.target.parentElement.parentElement;
    editRow = row;

    document.getElementById("nama").value = row.cells[0].textContent;
    document.getElementById("email").value = row.cells[1].textContent;
    document.getElementById("number").value = row.cells[2].textContent;
    document.getElementById("komentar").value = row.cells[3].textContent;
  };

  const onDelete = (e) => {
    if (confirm("Are you sure you want to delete this row?")) {
      const row = e.target.parentElement.parentElement;
      row.parentElement.removeChild(row);
      deleteFromLocalStorage(row.cells[0].textContent);
    }
  };

  const updateRow = (name, email, number, comment) => {
    editRow.cells[0].textContent = name;
    editRow.cells[1].textContent = email;
    editRow.cells[2].textContent = number;
    editRow.cells[3].textContent = comment;

    editRow = null;
  };

  const saveToLocalStorage = (name, email, number, comment) => {
    const data = { name, email, number, comment };
    let tableData = JSON.parse(localStorage.getItem("tableData")) || [];
    tableData.push(data);
    localStorage.setItem("tableData", JSON.stringify(tableData));
  };

  const updateLocalStorage = (row, name, email, number, comment) => {
    let tableData = JSON.parse(localStorage.getItem("tableData")) || [];
    const oldName = row.cells[0].textContent;
    const index = tableData.findIndex((item) => item.name === oldName);

    if (index !== -1) {
      tableData[index] = { name, email, number, comment };
      localStorage.setItem("tableData", JSON.stringify(tableData));
    }
  };

  const deleteFromLocalStorage = (name) => {
    let tableData = JSON.parse(localStorage.getItem("tableData")) || [];
    tableData = tableData.filter((item) => item.name !== name);
    localStorage.setItem("tableData", JSON.stringify(tableData));
  };

  const loadTableData = () => {
    const tableData = JSON.parse(localStorage.getItem("tableData")) || [];
    tableData.forEach((item) => {
      addRow(item.name, item.email, item.number, item.comment);
    });
  };

  // Prevent non-numeric input
  document.getElementById("number").addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  });

  // Function to convert Fahrenheit to Celsius
  const fahrenheitToCelsius = (fahrenheit) => {
    return ((fahrenheit - 32) * 5) / 9;
  };

  // Fahrenheit to Celsius conversion
  document.getElementById("conversion-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const fahrenheit = document.getElementById("fahrenheit").value;
    const celsius = fahrenheitToCelsius(fahrenheit);
    document.getElementById("result").textContent = `Result: ${celsius.toFixed(
      2
    )}°C`;
    document.getElementById("conversion-form").reset(); // Reset conversion form
  });

  // Real-time clock
  const updateClock = () => {
    const now = new Date();
    const formattedTime = `${String(now.getDate()).padStart(2, "0")}/${String(
      now.getMonth() + 1
    ).padStart(2, "0")}/${now.getFullYear()} ${String(now.getHours()).padStart(
      2,
      "0"
    )}:${String(now.getMinutes()).padStart(2, "0")}:${String(
      now.getSeconds()
    ).padStart(2, "0")}`;
    document.getElementById("clock").textContent = formattedTime;
  };

  setInterval(updateClock, 1000);
  updateClock(); // Initial call to set the clock immediately
});
