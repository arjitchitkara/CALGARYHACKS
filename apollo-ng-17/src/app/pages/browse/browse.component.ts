import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit {

  animals = [
    {
      name: 'Polar Bear',
      image: 'assets/images/polar-bear.jpg',
      description: 'Lives in the Arctic, threatened by climate change.'
    },
    {
      name: 'Amur Leopard',
      image: 'assets/images/amur-leopard.jpg',
      description: 'One of the rarest big cats, found in Russia and China.'
    },
    {
      name: 'Pangolin',
      image: 'assets/images/pangolin.jpg',
      description: 'The most heavily trafficked mammal in the world.'
    },
    {
      name: 'Hawksbill Turtle',
      image: 'assets/images/hawksbill-turtle.jpg',
      description: 'Critically endangered due to habitat loss and illegal trade.'
    },
    {
      name: 'Javan Rhino',
      image: 'assets/images/javan-rhino.jpg',
      description: 'Only around 80 remain in the wild due to poaching.'
    }
  ];

  constructor() { }

  ngOnInit(): void { }

  adoptAnimal(animal: any): void {
    // Here you can handle the adopt logic
    // e.g., show a dialog, call a service, etc.
    alert(`Adopting ${animal.name}!`);
  }
}
