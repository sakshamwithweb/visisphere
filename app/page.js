// Home page is for showing different courses,playlist etc.

import Card from "@/components/Card";
export default function Page() {
  // Here the list of courses will come from the DB.
  const arr = [
    { imageSrc: "/atom.jpeg", title: "Atom", description: "Learn the basics of the Atom editor" ,id:"1"},
    { imageSrc: "/atom.jpeg", title: "Atom", description: "Learn the basics of the Atom editor" ,id:"1"},
    { imageSrc: "/atom.jpeg", title: "Atom", description: "Learn the basics of the Atom editor" ,id:"1"},
    { imageSrc: "/atom.jpeg", title: "Atom", description: "Learn the basics of the Atom editor" ,id:"1"},
    { imageSrc: "/atom.jpeg", title: "Atom", description: "Learn the basics of the Atom editor" ,id:"1"},
    { imageSrc: "/atom.jpeg", title: "Atom", description: "Learn the basics of the Atom editor" ,id:"1"},
    { imageSrc: "/atom.jpeg", title: "Atom", description: "Learn the basics of the Atom editor" ,id:"1"},
    { imageSrc: "/atom.jpeg", title: "Atom", description: "Learn the basics of the Atom editor" ,id:"1"},
    { imageSrc: "/atom.jpeg", title: "Atom", description: "Learn the basics of the Atom editor" ,id:"1"},
    { imageSrc: "/atom.jpeg", title: "Atom", description: "Learn the basics of the Atom editor" ,id:"1"},
    { imageSrc: "/atom.jpeg", title: "Atom", description: "Learn the basics of the Atom editor" ,id:"1"},
  ]
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {arr.map((item) => (
        <Card
          key={item.id} 
          imageSrc={item.imageSrc}
          title={item.title}
          description={item.description}
        />
      ))}
    </div>
  );
}
