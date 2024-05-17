import { Component, OnInit } from '@angular/core';
import { PlayService } from './play.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit{
  message!: string;

  constructor(private playService: PlayService) {
    
  }

  ngOnInit(): void {
    this.playService.getPlayers().subscribe({
      next: (res: any) => {
        this.message = res.value.message;
      },
      error: (err: any) => console.error(err),
    })
  }

}
