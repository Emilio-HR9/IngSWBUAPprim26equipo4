import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare const require: any;
import { insertManualHeartRate, insertManualActivity, insertManualSleep } from '../../../../services/healthDataService.js';
import { getConnectedDevice } from '../../../../services/deviceService.js';
import { validateBPM, validateHRV, validateSteps, validateCalories, validateDistance, validateSleepMinutes, validateDateNotFuture, validateTimeRequired } from '../../../../utils/validators.js';

@Component({
  selector: 'app-manual-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manual-entry.component.html',
})
export class ManualEntryComponent implements OnInit {
  deviceId: string | null = null;
  tipoDato = '';
  fecha = new Date().toISOString().split('T')[0];
  hora = '08:00';
  saving = false;
  toast: any = null;

  bpm = '';
  hrv = '';
  contexto = 'reposo';

  pasos = '';
  calorias = '';
  distancia = '';

  horaDormir = '23:00';
  horaDespertar = '07:00';
  suenoLigero = '';
  suenoProfundo = '';
  suenoRem = '';

  async ngOnInit() {
    const device = await getConnectedDevice();
    if (device) {
      this.deviceId = device.id;
    }
  }

  getErrors() {
    const errors: any = {};
    const fechaVal = validateDateNotFuture(this.fecha);
    if (!fechaVal.valid) errors.fecha = fechaVal.message;
    const horaVal = validateTimeRequired(this.hora);
    if (!horaVal.valid) errors.hora = horaVal.message;

    if (!this.tipoDato) {
      errors.tipoDato = 'Selecciona un tipo de dato';
      return errors;
    }

    if (this.tipoDato === 'frecuencia_cardiaca') {
      const bpmVal = validateBPM(this.bpm);
      if (!bpmVal.valid) errors.bpm = bpmVal.message;
      if (this.hrv) {
        const hrvVal = validateHRV(this.hrv);
        if (!hrvVal.valid) errors.hrv = hrvVal.message;
      }
    }

    if (this.tipoDato === 'actividad_fisica') {
      const pasosVal = validateSteps(this.pasos);
      if (!pasosVal.valid) errors.pasos = pasosVal.message;
      const calVal = validateCalories(this.calorias);
      if (!calVal.valid) errors.calorias = calVal.message;
      const distVal = validateDistance(this.distancia);
      if (!distVal.valid) errors.distancia = distVal.message;
    }

    if (this.tipoDato === 'sueno') {
      const ligVal = validateSleepMinutes(this.suenoLigero, 'sueño ligero');
      if (!ligVal.valid) errors.suenoLigero = ligVal.message;
      const profVal = validateSleepMinutes(this.suenoProfundo, 'sueño profundo');
      if (!profVal.valid) errors.suenoProfundo = profVal.message;
      const remVal = validateSleepMinutes(this.suenoRem, 'sueño REM');
      if (!remVal.valid) errors.suenoRem = remVal.message;
    }

    return errors;
  }

  get isValid() {
    const errors = this.getErrors();
    return Object.keys(errors).length === 0 && this.tipoDato !== '';
  }

  showToast(message: string, type: string) {
    this.toast = { message, type };
    setTimeout(() => {
      this.toast = null;
    }, 3000);
  }

  async handleSave() {
    if (!this.isValid || !this.deviceId) return;
    this.saving = true;

    try {
      const timestamp = `${this.fecha}T${this.hora}:00`;

      if (this.tipoDato === 'frecuencia_cardiaca') {
        const result = await insertManualHeartRate(this.deviceId, {
          bpm: parseInt(this.bpm),
          hrv_ms: this.hrv ? parseFloat(this.hrv) : null,
          tipo: this.contexto,
          registrado_en: new Date(timestamp).toISOString(),
        });
        if (result) {
          this.showToast('Registro de frecuencia cardíaca guardado', 'success');
          this.resetForm();
        } else {
          this.showToast('Error al guardar el registro', 'error');
        }
      }

      if (this.tipoDato === 'actividad_fisica') {
        const result = await insertManualActivity(this.deviceId, {
          fecha: this.fecha,
          pasos: parseInt(this.pasos),
          calorias_kcal: parseFloat(this.calorias),
          distancia_km: parseFloat(this.distancia),
        });
        if (result) {
          this.showToast('Registro de actividad guardado', 'success');
          this.resetForm();
        } else {
          this.showToast('Error al guardar el registro', 'error');
        }
      }

      if (this.tipoDato === 'sueno') {
        const dormir = new Date(`${this.fecha}T${this.horaDormir}:00`);
        const despertar = new Date(`${this.fecha}T${this.horaDespertar}:00`);
        if (despertar <= dormir) despertar.setDate(despertar.getDate() + 1);
        const totalMin = Math.round((despertar.getTime() - dormir.getTime()) / 60000);

        const result = await insertManualSleep(this.deviceId, {
          fecha: this.fecha,
          hora_dormir: dormir.toISOString(),
          hora_despertar: despertar.toISOString(),
          duracion_total_min: totalMin,
          sueno_ligero_min: parseInt(this.suenoLigero),
          sueno_profundo_min: parseInt(this.suenoProfundo),
          sueno_rem_min: parseInt(this.suenoRem),
        });
        if (result) {
          this.showToast('Registro de sueño guardado', 'success');
          this.resetForm();
        } else {
          this.showToast('Error al guardar el registro', 'error');
        }
      }
    } catch (err) {
      this.showToast('Error inesperado al guardar', 'error');
    } finally {
      this.saving = false;
    }
  }

  resetForm() {
    this.bpm = ''; this.hrv = ''; this.contexto = 'reposo';
    this.pasos = ''; this.calorias = ''; this.distancia = '';
    this.suenoLigero = ''; this.suenoProfundo = ''; this.suenoRem = '';
  }
}
