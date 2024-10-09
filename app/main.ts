import Site from "./_component/site/site"

export const site = new Site()

export default function() {
  

  document.body.append(site)
}