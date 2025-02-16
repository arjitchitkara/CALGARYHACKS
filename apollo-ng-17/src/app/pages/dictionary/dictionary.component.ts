import { Component } from '@angular/core';

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.scss']
})
export class DictionaryComponent {
  endangeredAnimals = [
    { name: 'Polar Bear', description: 'Lives in the Arctic, threatened by climate change.' },
    { name: 'Pangolin', description: 'The world’s most trafficked mammal.' },
    { name: 'Amur Leopard', description: 'One of the rarest big cats, found in Russia and China.' },
    { name: 'Hawksbill Turtle', description: 'Critically endangered due to illegal trade and habitat loss.' },
    { name: 'Sumatran Orangutan', description: 'Deforestation and hunting are pushing it toward extinction.' }
  ];
}
