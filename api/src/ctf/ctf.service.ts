import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ctf } from './ctf.entity';
import { CreateCtfDto } from "./dtos/create-ctf.dto";
const Docker = require('dockerode');


@Injectable()
export class CtfService {
  private docker: any;

  constructor(
    @InjectRepository(Ctf)
    private ctfRepository: Repository<Ctf>,
  ) {
    this.docker = new Docker({ socketPath: '/var/run/docker.sock' });
  }

  async create(ctf: CreateCtfDto): Promise<Ctf> {
    const newCtf = this.ctfRepository.create(ctf);
    return await this.ctfRepository.save(newCtf);
  }

  async findAll(): Promise<Ctf[]> {
    return this.ctfRepository.find();
  }

  async launchCTF(ctfId: number): Promise<string> {
    try {
      const ctf = await this.ctfRepository.findOne({ where: { id: ctfId } });
      if (!ctf) {
        throw new Error('CTF non trouvé');
      }

      const images = await this.docker.listImages({ filters: { reference: [ctf.imageName] } });
      if (images.length === 0) {
        throw new Error(`L'image Docker ${ctf.imageName} n'a pas été trouvée`);
      }

      const containers = await this.docker.listContainers({ all: true });
      const existingContainer = containers.find(container =>
        container.Image === ctf.imageName && container.State === 'running'
      );

      if (existingContainer) {
        const portInfo = existingContainer.Ports.find(port => port.PrivatePort === 80);
        if (portInfo && portInfo.PublicPort) {
          return `http://localhost:${portInfo.PublicPort}`;
        } else {
          throw new Error('Impossible de récupérer le port du conteneur existant.');
        }
      }

      const port = this.getAvailablePort();

      // Configuration du conteneur Docker
      const container = await this.docker.createContainer({
        Image: ctf.imageName,
        ExposedPorts: { '80/tcp': {} },
        HostConfig: {
          PortBindings: { '80/tcp': [{ HostPort: `${port}` }] },
        },
      });

      // Démarrer le conteneur Docker
      await container.start();

      return `http://localhost:${port}`;
    } catch (error) {
      console.error('Erreur lors du lancement du CTF:', error.message || error);  // Log plus détaillé de l'erreur
      throw new Error('Erreur lors du lancement du CTF');
    }
  }

// Simule l'obtention d'un port libre pour le conteneur
  private getAvailablePort(): number {
    return Math.floor(Math.random() * (4000 - 3000) + 3000);
  }

}
