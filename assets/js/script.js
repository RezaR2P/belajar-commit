document.addEventListener("DOMContentLoaded", (event) => {
  const saveToLocalStorage = (data) => {
    localStorage.setItem("formData", JSON.stringify(data));
  };

  const loadFromLocalStorage = () => {
    const data = localStorage.getItem("formData");
    return data ? JSON.parse(data) : [];
  };

  const renderTable = () => {
    const data = loadFromLocalStorage();
    const dataTable = document.getElementById("data-table");
    dataTable.innerHTML = "";
    data.forEach((entry, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${entry.nama}</td>
          <td>${entry.email}</td>
          <td>${entry.number}</td>
          <td>${entry.komentar}</td>
          <td>
            <button class="btn btn-sm btn-primary edit-btn" data-index="${index}">Edit</button>
            <button class="btn btn-sm btn-danger delete-btn" data-index="${index}">Delete</button>
          </td>
        `;
      dataTable.appendChild(row);
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const nama = document.getElementById("nama").value;
    const email = document.getElementById("email").value;
    const number = document.getElementById("number").value;
    const komentar = document.getElementById("komentar").value;

    // Validasi input
    if (
      nama.trim() === "" ||
      email.trim() === "" ||
      number.trim() === "" ||
      komentar.trim() === ""
    ) {
      alert("Harap isi semua kolom!");
      return;
    }

    const data = loadFromLocalStorage();
    data.push({ nama, email, number, komentar });
    saveToLocalStorage(data);
    renderTable();
    document.getElementById("table-form").reset(); // Reset form inputs after submit
    alert("Form berhasil dikirim!");

    const successMessage = document.createElement("div");
    successMessage.classList.add("alert", "alert-success", "mt-3");
    successMessage.setAttribute("role", "alert");
    successMessage.textContent = "Form berhasil dikirim!";
    document.getElementById("table-form").appendChild(successMessage);

    setTimeout(() => {
      successMessage.remove();
    }, 3000);
  };

  const handleEdit = (index) => {
    const data = loadFromLocalStorage();
    const entry = data[index];
    document.getElementById("nama").value = entry.nama;
    document.getElementById("email").value = entry.email;
    document.getElementById("number").value = entry.number;
    document.getElementById("komentar").value = entry.komentar;

    document.getElementById("table-form").onsubmit = (event) => {
      event.preventDefault();
      entry.nama = document.getElementById("nama").value;
      entry.email = document.getElementById("email").value;
      entry.number = document.getElementById("number").value;
      entry.komentar = document.getElementById("komentar").value;

      data[index] = entry;
      saveToLocalStorage(data);
      renderTable();
      document.getElementById("table-form").reset(); // Reset form inputs after edit
      document.getElementById("table-form").onsubmit = handleFormSubmit;
    };
  };

  const handleDelete = (index) => {
    const data = loadFromLocalStorage();
    data.splice(index, 1);
    saveToLocalStorage(data);
    renderTable();
  };

  document.getElementById("data-table").addEventListener("click", (event) => {
    if (event.target.classList.contains("edit-btn")) {
      handleEdit(event.target.dataset.index);
    }
    if (event.target.classList.contains("delete-btn")) {
      handleDelete(event.target.dataset.index);
    }
  });

  const convertTemperature = (event) => {
    event.preventDefault();
    const fahrenheit = parseFloat(document.getElementById("fahrenheit").value);
    if (isNaN(fahrenheit)) {
      document.getElementById("result").textContent =
        "Please enter a valid number.";
    } else {
      const celsius = ((fahrenheit - 32) * 5) / 9;
      document.getElementById(
        "result"
      ).textContent = `${fahrenheit}°F is ${celsius.toFixed(2)}°C`;
    }
  };

  const updateClock = () => {
    const now = new Date();
    const formattedDate = `${padZero(now.getDate())}/${padZero(
      now.getMonth() + 1
    )}/${now.getFullYear()}`;
    const formattedTime = `${padZero(now.getHours())}:${padZero(
      now.getMinutes()
    )}:${padZero(now.getSeconds())}`;
    const dateTimeString = `${formattedDate} ${formattedTime}`;
    document.getElementById("clock").textContent = dateTimeString;
  };

  const padZero = (num) => {
    return num < 10 ? `0${num}` : num;
  };

  setInterval(updateClock, 1000);

  document.getElementById("table-form").onsubmit = handleFormSubmit;
  document.getElementById("conversion-form").onsubmit = convertTemperature;

  renderTable();
});
