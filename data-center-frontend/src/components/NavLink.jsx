import { NavLink as RouterNavLink } from "react-router-dom"

export function NavLink({ to, end, className, activeClassName, children }) {
  return (
    <RouterNavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        isActive ? `${className} ${activeClassName}` : className
      }
    >
      {children}
    </RouterNavLink>
  )
}
