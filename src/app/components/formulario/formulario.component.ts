import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Socio } from 'src/app/classes/socio';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {

  // Variable del objeto del formulario
  socio: FormGroup;
   // Array que contendrá a los objetos de la clase Socio
  arraySocios: Socio[]= [];
  dataSource = new MatTableDataSource();
  arrayNumeroSocio: number[]= [];

    // Array para el manejo de mat-table
  displayedColumns: string[] = ['socio' ,'nombre', 'apellidos', 'dni', 'telefono', 'sexo', 'borrar', 'modificar'];

    // Variable que identifica la tabla
  @ViewChild(MatTable) tabla!: MatTable<any>;
 
  // Variable booleana que activas cuando se está modificando un registro
  modificar:boolean= false;

  // variable que almacena el indice del registro que se está modificando
  indiceModificar :number= 0;

  constructor() { 

    this.socio = new FormGroup({
      nombre: new FormControl('',[Validators.required,Validators.minLength(3), Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i)]),
      apellidos: new FormControl('',[Validators.required,Validators.minLength(3), Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i)]),
      socio: new FormControl('',[Validators.required,  Validators.pattern('^[0-9]+')]),
      dni: new FormControl('',[Validators.required,Validators.maxLength(9),Validators.minLength(9), Validators.pattern('[0-9]{8}[A-Z]{1}')]),
      telefono: new FormControl('',[Validators.required,Validators.maxLength(9),Validators.minLength(9)]),
      sexo: new FormControl('',Validators.required)
    });
    this.dataSource.data = this.arraySocios;
  }

  // Función para validar que el numero de socio no esté repetido
  validaNumeroSocio(){
    if (this.arrayNumeroSocio.includes(this.socio.controls['socio'].value)){
      alert("El número de socio " + this.socio.controls['socio'].value + " ya existe.");
      this.socio.controls['socio'].setValue("");
    }
  }

  ngOnInit(): void {
  }

  onSubmit(formDirective: FormGroupDirective){

    // Se crea un nuevo objeto Socio a partir de los datos del formulario
    let nuevoSocio= new Socio(
      this.socio.controls["nombre"].value,
      this.socio.controls["apellidos"].value,
      this.socio.controls["socio"].value,
      this.socio.controls["dni"].value,
      this.socio.controls["telefono"].value,
      this.socio.controls["sexo"].value
    );
     // Añadimos el objeto al arraySocios
     this.arraySocios.push(nuevoSocio);

     // Añadimos el valor de socio, al arrayNumeroSocio
     this.arrayNumeroSocio.push(this.socio.controls["socio"].value);

    // Al actualizar el array que usa la tabla mat-table es necesario llamar al metodo renderRows()
    // para que se pinte de nuevo la tabla con los valores actualizados
    this.tabla.renderRows();

    // Reseteamos el formulario al incluir al nuevo socio para que quede limpio
    formDirective.resetForm();
    this.socio.reset();
  }

  // Función para borrar personas del array
  public funcionBorrar(indice: number): void{
    this.arrayNumeroSocio.splice(indice,1);
    this.arraySocios.splice(indice,1);
    this.tabla.renderRows();
  }

  // Función para modificar personas
  public funcionModificar(indice: number): void{
    this.modificar= true;
    this.indiceModificar= indice;
    this.socio.controls["nombre"].setValue(this.arraySocios[indice]._nombre);
    this.socio.controls["apellidos"].setValue(this.arraySocios[indice]._apellidos);
    this.socio.controls["socio"].setValue(this.arraySocios[indice]._socio);
    this.socio.controls["dni"].setValue(this.arraySocios[indice]._dni);
    this.socio.controls["telefono"].setValue(this.arraySocios[indice]._telefono);
    this.socio.controls["sexo"].setValue(this.arraySocios[indice]._sexo);
  }
  
  // Función para cancelar la edición
  public funcionCancelar(formDirective: FormGroupDirective): void{
    this.modificar= false;
    formDirective.resetForm();
    this.socio.reset();
  }

  // Función para guardar los cambios de la edición
  public funcionGuardar(formDirective: FormGroupDirective):void{
    this.arraySocios[this.indiceModificar]._nombre= (this.socio.controls["nombre"].value);
    this.arraySocios[this.indiceModificar]._apellidos= (this.socio.controls["apellidos"].value);
    this.arraySocios[this.indiceModificar]._socio= (this.socio.controls["socio"].value);
    this.arraySocios[this.indiceModificar]._dni= (this.socio.controls["dni"].value);
    this.arraySocios[this.indiceModificar]._telefono= (this.socio.controls["telefono"].value);
    this.arraySocios[this.indiceModificar]._sexo= (this.socio.controls["sexo"].value);
    this.tabla.renderRows();
    formDirective.resetForm();
    this.socio.reset();
    this.modificar= false;
    this.arrayNumeroSocio[this.indiceModificar] = this.arraySocios[this.indiceModificar]._socio;
  }

  //Funcion para el filtrado en la tabla
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
}