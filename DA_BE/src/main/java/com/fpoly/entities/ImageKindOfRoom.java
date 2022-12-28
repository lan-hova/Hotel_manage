package com.fpoly.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ImageKindOfRoom implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID", unique = true, nullable = false, precision = 10)
    private int id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "ID_KIND_OF_ROOM", nullable = false)
    private KindOfRoom kindOfRoom;

    @Column(name = "URL", nullable = false)
    private String url;

    @Column(name = "STATUS", nullable = false, precision = 10)
    private int status;
}
