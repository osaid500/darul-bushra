function header() {
  const header = document.createElement("header");
  header.innerHTML = `<header>
      <h1 class="header-text"><a href="/#">Darul-Bushra</a></h1>
      <nav>
        <ul class="nav-links">
          <li><a href="/#">Home</a></li>
          <li><a href="/pages/about.html">About</a></li>
        </ul>
      </nav>
    </header>`;
  document.body.appendChild(header);
}

header();
