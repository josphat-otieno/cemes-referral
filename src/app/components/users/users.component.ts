import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  public users:any = []

  constructor(
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
  }

  open(content:any) {
		this.modalService.open(content);
	}


}
