import './navbar.css'

export default function Navbar(){
  return (<div class="left-navigation">
        <div class="navigation-bar">
            <div class="home-button navigation-button">
              <a class="nativation-link" href="/" >
                <span class="material-symbols-outlined nav-icon">home</span>
                <p class='navigation-label'>Inicio</p>
              </a>
          </div>
            <div class="explore-button navigation-button">
            <a class='nativation-link'>
              <span class="material-symbols-outlined nav-icon">
                explore
              </span>
              <p class='navigation-label'>Explorar</p>
              </a>
            </div>

            <div class="bookmarks-button navigation-button">
              <a class="nativation-link" href="/user/saved/">
                <span class="material-symbols-outlined nav-icon">
                bookmarks</span>
                <p class='navigation-label'>Guardados</p>
              </a>
            </div>
          <div class="navigation-button">
            <a class="nativation-link" href="/{{ user.username }}/">
                <span class="material-symbols-outlined nav-icon">person_2</span>
                <p class='navigation-label'>Perfil</p>
            </a>
          </div>
        </div>
      </div>);
}